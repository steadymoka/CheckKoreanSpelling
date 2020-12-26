package land.moka.kmm.androidApp.ui.main

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import land.moka.androidApp.databinding.NavigationMainBinding
import land.moka.kmm.androidApp.ui.home.HomeLayout

class MainNavGraph : AppCompatActivity() {

    private val _view: NavigationMainBinding by lazy { NavigationMainBinding.inflate(layoutInflater) }

    private val adapter by lazy { MainPagerAdapter(this) }

    private val homeLayout by lazy { HomeLayout() }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(_view.root)

        initView()
    }

    private fun initView() {
        adapter.addItems(homeLayout)

        _view.viewPager.run {
            adapter = this@MainNavGraph.adapter
            offscreenPageLimit = 1
            isUserInputEnabled = false
        }
    }

}
