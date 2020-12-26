package land.moka.kmm.shared.app.network.error

import kotlinx.coroutines.InternalCoroutinesApi
import land.moka.kmm.shared.app.network.caller.Handler

open class SCErrorHandler : Handler, ErrorParser {

    override fun parseException(errorCode: String, message: String): TokenException {
        when (errorCode) {
            ErrorCode.TOKEN_EXPIRED.name,
            ErrorCode.AUTH_WRONG_TOKEN.name -> {
                return TokenException.TokenExpired(message)
            }

            ErrorCode.TOKEN_INVALID.name,
            ErrorCode.AUTH_UNDEFINED_TOKEN.name,
            ErrorCode.UNAUTHORIZED.name,
            ErrorCode.INVALID_RESOURCES.name -> {
                return TokenException.TokenInvalid(message)
            }

            ErrorCode.FORBIDDEN.name,
            ErrorCode.AUTH_FORBIDDEN.name -> {
                return TokenException.TokenForbidden(message)
            }
            else -> {
                return AppException.AppServer(message)
            }
        }
    }

    @InternalCoroutinesApi
    override fun invoke(exception: Exception) {
    }

}
