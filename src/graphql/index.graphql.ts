import gql from "graphql-tag";

export const countAsFriendGQL = gql`
	query me {
		me {
			countAsFriend
		}
	}
`;

export const countAsOwnerGQL = gql`
	query me {
		me {
			countAsOwner
		}
	}
`;
