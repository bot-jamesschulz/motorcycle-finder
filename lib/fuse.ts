import Fuse from 'fuse.js'
import locations from '@/public/USCities'

const fuseOptions = {
	includeScore: true,
	includeMatches: true,
	threshold: 0.4,
	keys: [
		"zipCode",
		"city",
		"fullName"
	]
};

const fuse = new Fuse(locations, fuseOptions);

export default fuse