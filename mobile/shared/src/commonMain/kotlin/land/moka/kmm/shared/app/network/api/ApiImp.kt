package land.moka.kmm.shared.app.network.api

import com.apollographql.apollo.*
import com.apollographql.apollo.api.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import land.moka.kmm.shared.app.network.caller.CallBuilder
import land.moka.kmm.shared.app.network.caller.createCaller

@ExperimentalCoroutinesApi
@ApolloExperimental
class ApiImp(
    var apolloClient: ApolloClient
) : Api {

    fun <D : Operation.Data, V : Operation.Variables> mutate(mutation: Mutation<D, D, V>): CallBuilder<D> {
        return apolloClient
            .mutate(mutation)
            .createCaller()
    }

    fun <D : Operation.Data, V : Operation.Variables> query(query: Query<D, D, V>): CallBuilder<D> {
        return apolloClient
            .query(query)
            .createCaller()
    }

    override fun checkSpelling(contents: String): CallBuilder<CheckSpellingMutation.Data> {
        return mutate(CheckSpellingMutation(Input.optional(contents)))
    }
}
