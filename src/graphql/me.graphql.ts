import gql from "graphql-tag";

/**
 * $data
 *
 * LoginAndAutoSignUpInput:
 * {
 *  code: string;
 * }
 */
export const loginAndAutoSignUpGQL = gql`
	mutation loginAndAutoSignUp($data: LoginAndAutoSignUpInput!) {
		loginAndAutoSignUp(data: $data) {
			accessToken
			refreshToken
			user {
				id
				openId
				createdAt
			}
		}
	}
`;

export const refreshTokenGQL = gql`
	mutation refreshToken($token: JWT!) {
		refreshToken(token: $token) {
			accessToken
			refreshToken
		}
	}
`;

export const meGQL = gql`
	query me {
		me {
			id
			createdAt
			updatedAt
			status
			countAsOwner
			countAsFriend
			nickName
		}
	}
`;
