document.addEventListener('DOMContentLoaded', function() {
    fetch('/getResults')
        .then(response => response.json())
        .then(data => {
            const leaderboardDiv = document.getElementById('leaderboard');
            // Create a table element to display the leaderboard
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            table.appendChild(thead);
            table.appendChild(tbody);

            // Create the header row
            const headerRow = document.createElement('tr');
            const headers = ['Rank', 'Username', 'Difficulty', 'Hits'];
            headers.forEach(headerText => {
                const header = document.createElement('th');
                header.textContent = headerText;
                headerRow.appendChild(header);
            });
            thead.appendChild(headerRow);

            // Populate the table with data
            data.forEach((entry, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${index + 1}</td>
                                <td>${entry.username || 'Anonymous'}</td>
                                <td>${entry.difficulty}</td>
                                <td>${entry.hits}</td>`;
                tbody.appendChild(tr);
            });

            leaderboardDiv.appendChild(table);
        })
        .catch(error => {
            console.error('Error loading leaderboard:', error);
            // Handle errors, such as by displaying a message to the user
        });
});
