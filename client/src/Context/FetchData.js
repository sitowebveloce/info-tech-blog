import React from 'react';

async function fetchData() {
    try {
        let myHeaders = new Headers();
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        let url = '/v1/api';
        let posts = await fetch(url, myInit);
        if (posts.ok) {
            let postsJson = await posts.json();
            console.log(postsJson.data);
            return postsJson.data;
        } else {
            alert("HTTP-Error: " + pass.status);
        }

    } catch (err) {
        if (err) console.log(err)
    }

};
fetchData();