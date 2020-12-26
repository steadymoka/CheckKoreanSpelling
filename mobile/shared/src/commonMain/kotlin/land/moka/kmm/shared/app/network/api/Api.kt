package land.moka.kmm.shared.app.network.api

import com.apollographql.apollo.CheckSpellingMutation
import land.moka.kmm.shared.app.network.caller.CallBuilder

interface Api {

    fun checkSpelling(contents: String): CallBuilder<CheckSpellingMutation.Data>

}
