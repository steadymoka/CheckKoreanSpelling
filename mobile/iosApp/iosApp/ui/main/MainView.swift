import SwiftUI
import shared

struct MainView: View {

    @State private var selection = 0
    
    var body: some View {
        return HomeView()
            .onAppear() {
                UITabBar.appearance().barTintColor = .white
                UITabBar.appearance().clipsToBounds = true
            }
        }
    
}

#if DEBUG
struct MainView_Previews: PreviewProvider {
    static var previews: some View {
        MainView()
    }
}
#endif
