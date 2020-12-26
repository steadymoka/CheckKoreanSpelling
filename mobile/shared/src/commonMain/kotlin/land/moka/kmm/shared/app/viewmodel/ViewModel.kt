package land.moka.kmm.shared.app.viewmodel

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.InternalCoroutinesApi
import kotlinx.coroutines.SupervisorJob
import land.moka.kmm.shared.lib.util.dispatcher
import kotlin.coroutines.CoroutineContext


abstract class ViewModel : CoroutineScope {

    @InternalCoroutinesApi
    override val coroutineContext: CoroutineContext
        get() = dispatcher() + SupervisorJob()

}
