package land.moka.kmm.shared.lib.util

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.InternalCoroutinesApi
import kotlinx.coroutines.Job

@InternalCoroutinesApi
expect fun launchCommonScope(work: suspend CoroutineScope.() -> Unit): Job
