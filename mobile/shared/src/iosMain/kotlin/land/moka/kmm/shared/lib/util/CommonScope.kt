package land.moka.kmm.shared.lib.util

import kotlinx.coroutines.*

@InternalCoroutinesApi
actual fun launchCommonScope(work: suspend CoroutineScope.() -> Unit): Job {
    return GlobalScope.launch(dispatcher()) {
        work()
    }
}
