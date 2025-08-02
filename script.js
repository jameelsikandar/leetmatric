

document.addEventListener("DOMContentLoaded", function () {


    const searchBtn = document.getElementById("search-btn");
    const userInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label')
    const hardLabel = document.getElementById('hard-label')
    const cardStatsContainer = document.querySelector('.stats-cards')

    // valid user
    const validateUsername = (username) => {
        if (username.trim == "") {
            alert("No username entered");
            return false;
        }

        const regex = /^[a-zA-Z0-9_-]{1,15}$/;

        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid username");
        }
        return isMatching;

    }


    async function fetchUserDetails(username) {

        try {
            searchBtn.textContent = "Searching...";
            searchBtn.disabled = true;
            statsContainer.classList.add("hidden");




            const proxyURL = `https://cors-anywhere.herokuapp.com/`;
            const targetURl = `https://leetcode.com/graphql/`;
            const myHeaders = new Headers();
            myHeaders.append('content-type', 'application/JSON');

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            });

            const requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: graphql,
                redirect: "follow"
            };

            const response = await fetch(proxyURL + targetURl, requestOptions);

            if (!response.ok) {
                throw new Error("Unable to fetch the user details");
            }

            const parsedData = await response.json();

            console.log("logging data ", parsedData);

            displayUserData(parsedData);



        } catch (error) {
            statsContainer.innerHTML = `<p>No data found </p>`

        }
        finally {
            searchBtn.textContent = "Search";
        }




    }


    function updateProgress(solved, total, label, circle) {
        const progressDegree = (solved / total) * 100;
        circle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }


    function displayUserData(parsedData) {

        statsContainer.classList.remove("hidden");



        const totalQues = parsedData.data.allQuestionsCount[0].count;
        const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
        const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
        const totalHardQues = parsedData.data.allQuestionsCount[3].count;

        const solvedTotalQues = parsedData.data.matchedUser.submitStats.
            acSubmissionNum[0].count;
        const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.
            acSubmissionNum[1].count;
        const solvedTotalMedQues = parsedData.data.matchedUser.submitStats.
            acSubmissionNum[2].count;
        const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.
            acSubmissionNum[3].count;




        updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
        updateProgress(solvedTotalMedQues, totalMediumQues, mediumLabel, mediumProgressCircle);
        updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);


        const cardData = [
            {
                label: "Overall Submissions",
                value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions
            },
            {
                label: "Overall Easy Submissions",
                value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions
            },
            {
                label: "Overall Medium Submissions",
                value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions
            },
            {
                label: "Overall Hard Submissions",
                value: parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions
            },
        ];

        console.log("Card ka data: ", cardData);

        cardStatsContainer.innerHTML = cardData.map(
            data => {
                return `
                    <div class="card">
                        <h4>${data.label}</h4>
                        <p>${data.value}</p>
                    </div>
                `
            }
        ).join("");



    }



    searchBtn.addEventListener('click', function () {

        const username = userInput.value;

        console.log(username);

        if (validateUsername(username)) {

            fetchUserDetails(username);


        }





    })
})