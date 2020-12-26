import Foundation
import SwiftUI
import shared

@main
struct _Application: App {
    
    static let container = AppContainer.Companion().start()
    
    var body: some Scene {
        WindowGroup {
            MainView()
        }
    }
    
}
