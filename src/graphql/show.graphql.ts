import gql from "graphql-tag";

export const listAsOwnerGQL = gql`
	query listAsOwner($questionnaireId: String!) {
		listAsOwner(questionnaireId: $questionnaireId) {
			friend {
				id
				nickName
				avatarUrl
			}
			visualization
		}
	}
`;

export const listAsFriendGQL = gql`
	query listAsFriend($questionnaireId: String!) {
		listAsFriend(questionnaireId: $questionnaireId) {
			friend {
				id
				nickName
				avatarUrl
			}
			visualization
		}
	}
`;
