package land.moka.kmm.shared.app.viewmodel.main

import com.apollographql.apollo.api.ApolloExperimental
import kotlinx.coroutines.InternalCoroutinesApi
import kotlinx.coroutines.launch
import land.moka.kmm.shared.app.network.api.Api
import land.moka.kmm.shared.app.viewmodel.ViewModel
import land.moka.kmm.shared.lib.log.Log

class HomeViewModel(
    private val api: Api
) : ViewModel() {

    @ApolloExperimental
    @InternalCoroutinesApi
    fun checkSpelling(contents: String, callback: (textToCopy: String?, textToDisplay: String?) -> Unit) {
        launch {
            try {
                val result = api.checkSpelling(contents).get()?.checkSpelling
                callback(result?.textToCopy, result?.textToDisplay)
            } catch (e: Exception) {
                callback(contents, contents.replace("\n", "<br />"))
            }
        }
    }

}
