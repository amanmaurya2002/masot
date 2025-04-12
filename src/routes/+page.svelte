<!-- 
    This website is designed to help people find events in Chandigarh 
    where they can hang out with friends and enjoy various activities. 
    It showcases a variety of events, including cultural festivals, 
    food gatherings, and sports matches.
-->

<script>
    let events = [
        {
            name: "IPL 2025: Punjab Kings vs. Rajasthan Royals",
            date: "April 5, 2025",
            location: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
            description: "An exciting IPL match featuring Punjab Kings and Rajasthan Royals."
        },
        {
            name: "IPL 2025: Punjab Kings vs. Chennai Super Kings",
            date: "April 8, 2025",
            location: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
            description: "A thrilling encounter between Punjab Kings and Chennai Super Kings."
        },
        {
            name: "IPL 2025: Punjab Kings vs. Kolkata Knight Riders",
            date: "April 15, 2025",
            location: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
            description: "A high-energy match between Punjab Kings and Kolkata Knight Riders."
        },
        {
            name: "IPL 2025: Punjab Kings vs. Royal Challengers Bengaluru",
            date: "April 20, 2025",
            location: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
            description: "A must-watch game between Punjab Kings and Royal Challengers Bengaluru."
        }
    ];
</script>

<div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
    <table class="table">
        <thead>
            <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            {#each events as event}
                <tr>
                    <td>{event.name}</td>
                    <td>{event.date}</td>
                    <td>{event.location}</td>
                    <td>{event.description}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

