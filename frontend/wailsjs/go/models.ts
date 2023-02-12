export namespace main {
	
	export class Gist {
	    description: string;
	    public: boolean;
	    files: any;
	
	    static createFrom(source: any = {}) {
	        return new Gist(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.description = source["description"];
	        this.public = source["public"];
	        this.files = source["files"];
	    }
	}

}

