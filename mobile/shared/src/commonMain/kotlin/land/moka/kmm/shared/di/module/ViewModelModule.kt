package land.moka.kmm.shared.di.module

import land.moka.kmm.shared.app.network.api.Api
import land.moka.kmm.shared.app.network.api.ApiImp
import land.moka.kmm.shared.app.viewmodel.main.HomeViewModel
import org.kodein.di.DI
import org.kodein.di.bind
import org.kodein.di.factory
import org.kodein.di.instance

val viewModelModules = DI.Module("viewModels") {

    bind<HomeViewModel>() with factory {
        HomeViewModel(instance() as Api)
    }

}
