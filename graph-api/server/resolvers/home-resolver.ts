import axios from 'axios'
import { GraphQLResolver, Query, Mutation, GraphQLObject } from 'graphity'
import { GraphQLNonNull, GraphQLString } from 'graphql'
import { ApiResponse, SpellError } from '../interfaces/types'
import { stringify } from 'qs'
import { Parser } from 'htmlparser2'

@GraphQLResolver()
export class HomeResolver {

  @Query({
    returns: () => GraphQLNonNull(GraphQLString),
  })
  public version(): string {
    return require('../package.json').version // eslint-disable-line import/no-unresolved,@typescript-eslint/no-require-imports
  }

  @Mutation({
    input: { 
      contents: { type: GraphQLString },
    },
    returns: () => GraphQLObject({
      name: 'CheckSpellingResponse',
      fields: {
        textToCopy: GraphQLNonNull(GraphQLString),
        textToDisplay: GraphQLNonNull(GraphQLString),
      }
    })
  })
  public async checkSpelling(parent: null, input: { contents?: string | null }) {
    let url = 'https://speller.cs.pusan.ac.kr/results'
    let contents = (input.contents ?? "").split(/\r?\n/).map(line => line.trim()).join('\r\n')
    let body = stringify({
      text1: contents,
    }, {
      format: 'RFC1738',
    })
    const { data } = await axios.post(url, body)

    let result = JSON.parse(data.split(/data\s=\s/i)[1].split(/;(\n|\r)\s+pageIdx/)[0])[0]
    
    let newMessage = result.str
    let errorInfos = result.errInfo as Array<SpellError>
    
    errorInfos.reverse().forEach((error: SpellError) => {
      let errorMethod = error.correctMethod
      
      let start = error.start
      let end = error.end
      
      let newWord = error.candWord.split('|')[0]

      let pre = newMessage.slice(0, start)
      let post = newMessage.slice(end, newMessage.length)

      let color = 'blue'
      if (errorMethod == 2) {
        color = 'red'
      } else if (errorMethod == 3) {
        color = 'lightbrown'
      } else if (errorMethod == 4) {
        color = 'green'
      } else if (errorMethod == 6) {
        color = 'darkmagenta'
      }

      let preCss = `<b><font color="${color}">`
      let postCss = '</font></b>'
      newMessage = pre + preCss + newWord + postCss + post
    })

    var textToCopy = ""
    let textToDisplay = newMessage.replace(/\r\n?/g, '<br />')
    const parser = new Parser({
        ontext(text) {
          textToCopy += text
        },
        onclosetag(tagname) {
          if (tagname === "br") {
            textToCopy += '\n'
          }
      },
    })
    parser.write(textToDisplay)
    parser.end()
    return {
      textToCopy: textToCopy,
      textToDisplay: textToDisplay,
    }
  }

}
