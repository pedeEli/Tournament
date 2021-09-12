import type {Tournament} from '../Types'
import {proxy, snapshot, subscribe} from 'valtio'
import type {Readable, Subscriber, Unsubscriber} from 'svelte/store'


export const loadTournament = () => {
    const tournamentStr = localStorage.getItem('tournament')
    const tournament = JSON.parse(tournamentStr) ?? createEmptyTournament()
    return proxy<Tournament>(tournament)
}

export const toStore = <T extends object>(value: T): Readable<T>  => {
    return {
        subscribe(run: Subscriber<T>): Unsubscriber {
            run(snapshot(value) as T)
            return subscribe(value, () => {
                run(snapshot(value) as T)
            })
        }
    }
}

const createEmptyTournament = (): Tournament => {
    return {
        settings: {
            name: 'Tunier',
            state: 'editingContestants',
            luckyLoser: false,
            winnerPerGroup: 2
        },
        contestants: {},
        matches: {},
        groups: {},
        finales: {},
    }
}