import gql from "graphql-tag";

export const meGQL = gql`
	query me {
		me {
			questionnairesAsOwnerAsFriend {
				questionnaire {
					id
					type
					title
					description
				}
			}
		}
	}
`;

export const findAllQGQL = gql`
	query findAllQ {
		findAllQ {
			id
			title
			description
			questions {
				id
				description
				options
			}
		}
	}
`;

export const findOneQGQL = gql`
	query findOneQ($questionnaireId: String!) {
		findOneQ(questionnaireId: $questionnaireId) {
			id
			title
			description
			questions {
				description
				options
			}
		}
	}
`;

export const writeGQL = gql`
	mutation write($data: CreateU2QInput!) {
		write(data: $data) {
			result
		}
	}
`;

export const findOneU2QGQL = gql`
	query findOneU2Q($data: findOneU2QInput!) {
		findOneU2Q(data: $data) {
			result
		}
	}
`;
