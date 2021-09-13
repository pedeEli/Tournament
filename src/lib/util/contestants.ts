import type {Contestant, Contestants} from '../Types'

type ContestantTypes = `${Contestant['type']}s`

type GroupedContestants = {
    [key in ContestantTypes]?: Contestant[]
}

export const groupByType = (contestants: Contestants): GroupedContestants => {
    const groups: GroupedContestants = {}
    for (const contestant of Object.values(contestants)) {
        let index: ContestantTypes = `${contestant.type}s`
        const g = groups[index] ?? []
        g.push(contestant)
        groups[index] = g
    }
    return groups
}