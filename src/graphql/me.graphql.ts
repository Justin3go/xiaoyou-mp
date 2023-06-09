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
	mutation getPostObjectParams {
		getPostObjectParams {
			OSSAccessKeyId
			policy
			signature
		}
	}
`;

export const listAsOwnerGQL = gql`
	query listAsOwner($questionnaireId: String!) {
		listAsOwner(questionnaireId: $questionnaireId) {
			friend {
				id
				nickName
				avatarUrl
			}
			owner {
				id
			}
			similarity
		}
	}
`;

export const listAsFriendGQL = gql`
	query listAsFriend($questionnaireId: String!) {
		listAsFriend(questionnaireId: $questionnaireId) {
			friend {
				id
			}
			owner {
				id
				nickName
				avatarUrl
			}
			similarity
		}
	}
`;

export const chatGQL = gql`
	mutation chat($talk: String!) {
		customerChat(talk: $talk) {
			knowledge
			text
			recommend
		}
	}
`;

export const chatGPT_GQL = gql`
	mutation chatGPT($talk: String!) {
		chatGPT(talk: $talk)
	}
`;
