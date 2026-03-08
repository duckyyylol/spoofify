interface _spotifyPlaybackState {
	device: {
		id: string;
		is_active: boolean;
		is_private_session: boolean;
		is_restricted: boolean;
		name: string;
		type: string;
		volume_percent: number;
		supports_volume: boolean
	},
	repeat_state: string;
	shuffle_state: boolean;
	context: {
		type: string;
		href: string;
		external_urls: {
			spotify: string;
		},
		uri: string;
	},
	timestamp: 0,
	progress_ms: 0,
	is_playing: boolean;
	item: _spotifyTrack;
	currently_playing_type: string;
	actions: {
		interrupting_playback: boolean;
		pausing: boolean;
		resuming: boolean;
		seeking: boolean;
		skipping_next: boolean;
		skipping_prev: boolean;
		toggling_repeat_context: boolean;
		toggling_shuffle: boolean;
		toggling_repeat_track: boolean;
		transferring_playback: boolean;
	}
}

interface _spotifyArtist {
	external_urls: {
		spotify: string;
	},
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
}

interface _spotifyTrack {
	album: {
		album_type: string;
		total_tracks: number;
		available_markets: string[];
		external_urls: {
			spotify: string;
		},
		href: string;
		id: string;
		images: {
			url: string;
			height: number;
			width: number;
		}[];
		name: string;
		release_date: string;
		release_date_precision: string;
		restrictions: {
			reason: string;
		},
		type: string;
		uri: string;
		artists: _spotifyArtist[]
	},
	artists: _spotifyArtist[]
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
		isrc: string;
		ean: string;
		upc: string;
	},
	external_urls: {
		spotify: string;
	},
	href: string;
	id: string;
	is_playable: boolean;
	linked_from: {
	},
	restrictions: {
		reason: string;
	},
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: string;
	uri: string;
	is_local: boolean;
}

interface _spotifyQueueResponse {
	currently_playing: _spotifyTrack;
	queue: _spotifyTrack[]
}

interface _searchedTrack {
	id: string;
	title: string;
	artist: string;
	album: string | null;
	href: string;
	uri: string;
	imageUrl: string;
}

interface _spotifyUser {
	country: string;
	display_name: string;
	email: string;
	explicit_content: {
		filter_enabled: boolean;
		filter_locked: boolean;
	},
	external_urls: {
		spotify: string;
	},
	followers: {
		href: string;
		total: number;
	},
	href: string;
	id: string;
	images: {
		url: string;
		height: number;
		width: number;
	}[]
	product: string;
	type: string;
	uri: string;
}

interface _tokenResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
}

interface _apiQueueItem {
	id: string;
	songId: string;
	title: string;
	artist: string;
	album: string;
	addedTimestamp: number;
}

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	export type SearchedTrack = _searchedTrack;
	export type TokenResponse = _tokenResponse;
	export type PlaybackState = _spotifyPlaybackState;
	export type SpotifyQueue = _spotifyQueueResponse;
	export type SpotifyUser = _spotifyUser;
	export type SpotifyTrack = _spotifyTrack;
	export type SpotifyArtist = _spotifyArtist

	export type QueueItem = _apiQueueItem;

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
