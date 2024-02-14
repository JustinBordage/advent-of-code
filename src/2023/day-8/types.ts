export type NodePos = string;

export interface MapInstructions {
	directions: ("L" | "R")[];
	numOfDirections: number;
	nodes: Map<NodePos, MapNode>;
}

export interface MapNode {
	/** The destination if taking the left path. */
	L: string;
	/** The destination if taking the right path. */
	R: string;
}