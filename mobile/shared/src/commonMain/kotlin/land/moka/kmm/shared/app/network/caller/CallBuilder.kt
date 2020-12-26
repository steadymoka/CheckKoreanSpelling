package land.moka.kmm.shared.app.network.caller

import com.apollographql.apollo.ApolloCall
import com.apollographql.apollo.ApolloException
import com.apollographql.apollo.ApolloHttpException
import com.apollographql.apollo.ApolloNetworkException
import com.apollographql.apollo.api.ApolloExperimental
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.InternalCoroutinesApi
import kotlinx.coroutines.channels.BroadcastChannel
import kotlinx.coroutines.flow.single
import kotlinx.coroutines.launch
import land.moka.kmm.shared.app.network.error.AppException
import land.moka.kmm.shared.app.network.error.ErrorParser
import land.moka.kmm.shared.app.network.error.TokenException
import land.moka.kmm.shared.lib.log.Log
import land.moka.kmm.shared.lib.util.launchCommonScope
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class CallBuilder<T>(

    private var apolloCall: ApolloCall<T>,
    private var errorParser: ErrorParser

) : Caller<T> {

    private var errorHandler: Handler? = null

    private var globalErrorHandler: Handler? = null

    override fun setErrorHandler(handler: Handler): CallBuilder<T> {
        errorHandler = handler
        return this
    }

    override fun setGlobalErrorHandler(handler: Handler): CallBuilder<T> {
        globalErrorHandler = handler
        return this
    }

    @ApolloExperimental
    @InternalCoroutinesApi
    override suspend fun get(): T? {
        try {
            val response = apolloCall.execute().single()
            val error = response.errors?.firstOrNull()
                ?: return response.data!!

            val message = error.message
            val errorCode = error.customAttributes["code"].toString()
            val exception = errorParser.parseException(errorCode, message)
            globalErrorHandler?.invoke(exception)

            if (null != errorHandler) {
                errorHandler?.invoke(exception)
                return null
            } else {
                Log.print("e: parseException $exception")
                throw exception
            }
        } catch (e: ApolloNetworkException) {
            val exception = AppException.Network(e.message ?: "ApolloNetworkException")
            globalErrorHandler?.invoke(exception)

            if (null != errorHandler) {
                errorHandler?.invoke(exception)
                return null
            } else {
                Log.print("e: AppException.Network $exception")
                throw exception
            }
        } catch (e: ApolloHttpException) {
            val exception = AppException.AppServer(e.message ?: "ApolloHttpException")
            globalErrorHandler?.invoke(exception)

            if (null != errorHandler) {
                errorHandler?.invoke(exception)
                return null
            } else {
                Log.print("e: AppException.HashupServer $exception")
                throw exception
            }
        } catch (e: ApolloException) {
            Log.print("e: ApolloException $e")
            throw e
        }
    }

    @ApolloExperimental
    @InternalCoroutinesApi
    suspend fun commonGet(): T? {
        return suspendCoroutine { continuation ->
            launchCommonScope {
                continuation.resume(get())
            }
        }
    }

    @InternalCoroutinesApi
    override suspend fun call(callback: (T?) -> Unit) {
        val res = get()
        callback.invoke(res)
    }

}
