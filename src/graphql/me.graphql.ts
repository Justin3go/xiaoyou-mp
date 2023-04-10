import gql from "graphql-tag";

export const loginAndAutoSignUpGQL = gql`
	mutation loginAndAutoSignUp($data: LoginAndAutoSignUpInput!) {
		loginAndAutoSignUp(data: $data) {
			accessToken
			refreshToken
			user {
				id
				openId
				createdAt
				avatarUrl
				nickName
				gender
				province
				birthday
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
			avatarUrl
		}
	}
`;

export const updateUserGQL = gql`
	mutation updateUser($data: UpdateUserInput!) {
		updateUser(data: $data) {
			avatarUrl
			nickName
		}
	}
`;

export const getPostObjectParamsGQL = gql`
	query getPostObjectParams {
		getPostObjectParams {
			OSSAccessKeyId
			policy
			signature
		}
	}
`;
