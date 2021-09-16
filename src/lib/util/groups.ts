import type {Group} from '../Types'

export const getAssignedContestants = (groups: Group[]) => groups.map(group => group.members).flat(1)