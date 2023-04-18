export interface rankDataI {
  [questionnaireId: string]: {
    id: string;
    nickName: string;
    avatarUrl: string;
    similarity: number;
  }[]
}