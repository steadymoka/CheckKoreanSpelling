package land.moka.kmm.shared.app.network.caller

import com.apollographql.apollo.ApolloCall
import land.moka.kmm.shared.app.network.error.SCErrorHandler

fun <T> ApolloCall<T>.createCaller(): CallBuilder<T> {
    return CallBuilder(this, SCErrorHandler())
}
