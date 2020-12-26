import SwiftUI
import Combine
import shared

struct HomeView: View {

    let viewModel = _Application.container.getHomeViewModel()

    @State var inputText: String = ""
    
    @State var textToDisplay: String = "<i><font color=\"#bcbcbc\">Done is better than perfect.</font></i>"
    @State var textToCopy: String = ""
    @State var displayCopied: Bool = false
    
    private let subject = PassthroughSubject<String, Never>()
    @State var cancellable: AnyCancellable? = nil
    
    var body: some View {
        return ZStack {
            VStack {
                Text("⭐️")
                    .font(.headline)
                    .padding(.top, 18)
                    .padding(.bottom, 10)

                HStack {
                    Spacer(minLength: 20)
                    VStack { Divider() }
                    Spacer(minLength: 20)
                }
                
                ZStack(alignment: .leading) {
                    TextEditor(text: $inputText)
                        .lineSpacing(4)
                        .padding(.top, 2)
                        .padding(.leading, 20)
                        .padding(.trailing, 20)
                        .onChange(of: inputText) { (value) in
                            subject.send(value)
                        }
                    if inputText.isEmpty {
                        VStack {
                            HStack {
                                Text("입력해주세요.")
                                    .opacity(0.2)
                                    .padding(.top, 10)
                                    .padding(.leading, 25)
                                    .padding(.trailing, 20)
                                Spacer()
                            }
                            Spacer()
                        }
                        
                    }
                }
                
                Spacer()

                HStack {
                    if !inputText.isEmpty {
                        Text("Remove all")
                            .italic()
                            .foregroundColor(Color(hex: 0xAFAFAF))
                            .padding(.leading, 24)
                            .padding(.bottom, 6)
                            .onTapGesture {
                                inputText = ""
                                textToDisplay = ""
                                textToCopy = ""
                            }
                    }
                    Spacer()
                    if displayCopied {
                        Text("copied")
                            .italic()
                            .opacity(0.36)
                            .foregroundColor(Color(hex: 0xAFAFAF))
                            .padding(.trailing, 24)
                            .padding(.bottom, 6)
                    }
                }
                
                Rectangle()
                    .frame(maxWidth: .infinity, maxHeight: 142)
                    .foregroundColor(Color(hex: 0xF6F6F6))
                    .cornerRadius(3.0)
                    .shadow(color: Color(hex: 0xCFCFCF), radius: 3, x: 1.0, y: 2.0)
                    .padding(.leading, 20)
                    .padding(.trailing, 20)
                    .padding(.bottom, 16)
                    .overlay(
                        ScrollView(.vertical) {
                            AttributedText(formatted: textToDisplay)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .multilineTextAlignment(.leading)
                                .padding(.bottom, 12)
                                .padding(.top, 6)
                                .padding(.leading, 6)
                                .padding(.trailing, 6)
                        }
                        .padding(.leading, 26)
                        .padding(.trailing, 26)
                        .padding(.top, 6)
                        .padding(.bottom, 22)
                    )
                    .onTapGesture {
                        if (textToCopy.isEmpty) { return }
                        UIPasteboard.general.string = textToCopy
                    }
            }
        }
        .onAppear() {
            onApear()
        }
    }

    func onApear() {
        self.cancellable = subject
            .debounce(for: .milliseconds(777), scheduler: RunLoop.main)
            .sink { text in
                if (text.isEmpty) {
                    self.textToDisplay = "<i><font color=\"#bcbcbc\">Done is better than perfect.</font></i>"
                    self.textToCopy = ""
                    return
                }
                viewModel.checkSpelling(contents: text) { (textToCopy, textToDisplay) in
                    if let textToDisplay = textToDisplay as? String, let textToCopy = textToCopy as? String {
                        self.textToDisplay = textToDisplay
                        self.textToCopy = textToCopy
                    }
                    UIPasteboard.general.string = textToCopy
                    
                    displayCopied = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                        withAnimation {
                            displayCopied = false
                        }
                    }
                }
            }
    }
    
}
