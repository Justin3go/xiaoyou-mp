export interface QuestionnaireI {
	id: string;
	type: number;
	title: string;
	description: string;
}

export interface QuestionI {
	id: string;
	description: string;
	options: any;
}
