Nginx Manager
=============

**What this is:**
- A web-based file editor (using Ace)
- The intention of this is to make managing server configurations easier, one example of this is nginx sites.
- It loads folder structure, and presents it back. You can edit files as you wish, and save them.

**What this isn't:**
- Production-ready
	- `Use at your own risk`

![Screenshot of the Editor](Screenshots/screen.png)

TODO & Bugs
-----------

- Only works for files, trying to open directories will not work (have not tried)
- It doesn't check the path for relative parts, therefore it may be possible to traverse high up the directory tree to access something else.
	- Don't let anyone you don't trust use this.
- Create and Delete files
- Traverse Folders
- Automatically switch style based on extension
- Be able to load/save/delete files over SSH/FTP Connections

License
-------

MIT
