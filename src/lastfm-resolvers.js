/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

const lastFmUrl = 'https://ws.audioscrobbler.com/2.0/';
const lastFmGetRecentTracks = 'user.getrecenttracks';

export async function fetchLastFmTracks(
	apiKey,
	username,
	numberOfTracks = '1'
) {
	return fetch(
		`${ lastFmUrl }?method=${ lastFmGetRecentTracks }&user=${ username }&api_key=${ apiKey }&format=json&limit=${ numberOfTracks }`
	)
		.then( ( response ) => response.json() )
		.then( ( data ) => {
			if ( data.error ) {
				throw data.message;
			} else if ( data.recenttracks[ '@attr' ]?.total === '0' ) {
				throw sprintf(
					// translators: %s: Last.fm username
					__(
						'No Last.fm tracks found from user "%s".',
						'lastfm-recently-played-block'
					),
					username
				);
			}
			if ( data.recenttracks.track ) {
				let tracks = data.recenttracks.track;

				// Check if number of tracks returned matches the requested number of tracks.
				// Sometimes the API returns an extra track.
				if (
					data.recenttracks.track.length ===
					parseInt( numberOfTracks ) + 1
				) {
					tracks = data.recenttracks.track.slice( 0, numberOfTracks );
				}
				return tracks;
			}
			return [];
		} )
		.catch( ( error ) => {
			throw error;
		} );
}
