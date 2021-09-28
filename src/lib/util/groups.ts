import type {Group, Match, Matches} from '../Types'
import {createId, keys, values} from './tournament'

export const getAssignedContestants = (groups: Group[]) => groups.map(group => group.members).flat(1)

export const createAndAssignMatches = (group: Group, matches: Matches) => {
    const matchPairs = createAllMatchPairs(group.members)
    const matchesList = values(matches)
    group.matches = matchPairs.map(([leftId, rightId]) => {
        const existingMatchId = findMatchWithIds(matchesList, leftId, rightId)
        if (existingMatchId) return existingMatchId

        const matchId = createId(keys(matches))
        matches[matchId] = createNewMatch(matchId, leftId, rightId)
        return matchId
    })
}

const createAllMatchPairs = (ids: string[]): [string, string][] => {
    const pairs = []
    for (let i = 0; i < ids.length - 1; i++) {
        const leftId = ids[i]
        for (let j = i + 1; j < ids.length; j++) {
            const rightId = ids[j]
            pairs.push([leftId, rightId])
        }
    }
    return pairs
}

const findMatchWithIds = (matches: Match[], leftId: string, rightId: string): string | undefined => {
    return matches.find(({left, right}) => left === leftId && right === rightId )?.id
}

const createNewMatch = (id: string, left: string, right: string): Match => {
    return {
        id, left, right,
        state: 'waiting',
        leftScore: 0,
        rightScore: 0
    }
}

export const removeMatches = (group: Group, matches: Matches) => {
    group.matches.forEach(id => delete matches[id])
}

export const removeMatchesOfContestant = (id: string, group: Group, matches: Matches) => {
    const toRemove = values(matches).filter(({left, right}) => left === id || right === id).map(({id}) => id)
    toRemove.forEach(id => removeMatch(id, group, matches))
}

const removeMatch = (id: string, group: Group, matches: Matches) => {
    delete matches[id]
    const index = group.matches.findIndex(_id => _id === id)
    group.matches.splice(index, 1)
}

export const reassignMatchesAfterRandomize = (groups: Group[], matches: Matches) => {
    const oldMatches = groups.map(({matches}) => matches).flat(1)
    groups.forEach(group => {
        group.matches = []
        createAndAssignMatches(group, matches)
    })
    const newMatches = groups.map(({matches}) => matches).flat(1)
    newMatches.forEach(id => {
        const index = oldMatches.findIndex(_id => _id === id)
        if (index === -1) return
        oldMatches.splice(index, 1)
    })
    oldMatches.forEach(id => delete matches[id])
}