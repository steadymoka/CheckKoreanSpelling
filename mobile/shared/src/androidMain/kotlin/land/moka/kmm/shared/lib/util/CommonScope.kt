package land.moka.kmm.shared.lib.util

import kotlinx.coroutines.*

actual fun launchCommonScope(work: suspend CoroutineScope.() -> Unit): Job {
    return GlobalScope.launch(Dispatchers.Main) {
        work()
    }
}
