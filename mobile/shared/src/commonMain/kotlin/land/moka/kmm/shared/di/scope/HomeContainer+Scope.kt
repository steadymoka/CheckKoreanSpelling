package land.moka.kmm.shared.di.scope

import land.moka.kmm.shared.app.viewmodel.main.HomeViewModel
import land.moka.kmm.shared.di.AppContainer
import land.moka.kmm.shared.di.scope.index.Container
import land.moka.kmm.shared.di.scope.index.BaseScope
import org.kodein.di.instance

class HomeContainer(
    var viewModel: HomeViewModel
) : Container {

    companion object Scope : BaseScope {

        override fun create(container: AppContainer) {
            container.childContainers[HomeContainer::class.simpleName ?: "HomeContainer"] = HomeContainer(container.directDI.instance())
        }

        override fun destroy(container: AppContainer) {
            container.childContainers.remove(HomeContainer::class.simpleName ?: "HomeContainer")
        }

    }

}
