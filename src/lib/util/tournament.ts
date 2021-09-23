import type {Tournament} from '../Types'
import {proxy, snapshot, subscribe} from 'valtio'
import type {Readable, Subscriber, Unsubscriber} from 'svelte/store'
import {v4} from 'uuid'


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
            name: 'Turnier',
            state: 'mainMenu',
            haveGroups: false,
            luckyLoser: false,
            winnerPerGroup: 2,
            addingContestant: {
                addingType: 'team',
                teamName: '',
                personName: '',
                members: []
            }
        },
        contestants: {},
        matches: {},
        groups: {},
        finales: {},
    }
}

export const createId = (ids: string[]) => {
    while (true) {
        const id = v4()
        if (ids.find(_id => _id === id)) continue
        return id
    }
}

export const values = <T>(obj: {[id: string]: T}) => Object.values(obj)

export const keys = (obj: object) => Object.keys(obj)