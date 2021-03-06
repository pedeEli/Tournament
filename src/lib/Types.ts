export interface Tournament {
    settings: Settings,
    contestants: Contestants,
    matches: Matches,
    groups: Groups,
    finales: Finales
}

export interface Settings {
    name: string,
    state: 'mainMenu' | 'editingContestants' | 'editingGroups' | 'running',
    haveGroups: boolean,
    luckyLoser: boolean,
    winnerPerGroup: number
    addingContestant: {
        addingType: 'person' | 'team',
        teamName: string,
        personName: string,
        members: string[]
    }
}

export interface Contestants {
    [id: string]: Contestant
}

export type Contestant = Person | Team

export interface Person {
    id: string,
    type: 'person',
    name: string
}

export interface Team {
    id: string,
    type: 'team',
    name: string,
    members: string[]
}

export interface Matches {
    [id: string]: Match
}

export interface Match {
    id: string,
    state: 'waiting' | 'running' | 'paused' | 'leftWon' | 'rightWon',
    left: string,
    right: string
    leftScore: number,
    rightScore: number
}

export interface Groups {
    [id: string]: Group
}

export interface Group {
    id: string,
    name: string
    members: string[],
    matches: string[]
}

export interface Finales {
    [id: string]: Finale
}

export interface Finale {
    id: string
    parentId: string,
    matchId: string
}