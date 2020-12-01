# wattry.dev

This page attempts to provide a simple web application architecture to demonstrate some of my skills.

The web application was created with material-ui react in TypeScript and the backend apis are constructed with node.js and ExpressJs running in a container. The persistence layer is a postgres db instance.

The page allows an interested user to login in using LinkedIn's social OAuth which allows a user to interact with me. The intent is not an unnecessary exchange of data but to demonstrate an implementation of a 3 stage oAuth flow and allows me to illustrate using secure http only cookies to authenticate user requests. This also allows me to store data in an indexeddb instance instead of traditional localStorage type pattern.

A big thanks to <a href="https://www.openode.io/">Cloud hosted on opeNode.io</a> for providing free hosting and great nodejs services.
