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
            time: "April 5, 2025",
            location: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
            other_info: "An exciting IPL match featuring Punjab Kings and Rajasthan Royals."
        },
        {
            name: "IPL 2025: Punjab Kings vs. Chennai Super Kings",
            time: "April 8, 2025",
            location: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
            other_info: "A thrilling encounter between Punjab Kings and Chennai Super Kings."
        },
        {
            name: "IPL 2025: Punjab Kings vs. Kolkata Knight Riders",
            time: "April 15, 2025",
            location: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
            other_info: "A high-energy match between Punjab Kings and Kolkata Knight Riders."
        },
        {
            name: "IPL 2025: Punjab Kings vs. Royal Challengers Bengaluru",
            time: "April 20, 2025",
            location: "Maharaja Yadavindra Singh Cricket Stadium, Mohali",
            other_info: "A must-watch game between Punjab Kings and Royal Challengers Bengaluru."
        }
    ];
</script>

<div class="p-4">
    <p class="text-4xl text-center mb-4">Events in Chandigarh</p>
    <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-4 justify-center p-2">
        {#each events as event}
            <div class="card border border-base-content/5 bg-base-125 shadow-md p-4 rounded-lg">
                <span class="badge badge-soft p-2 mb-2">{event.time}</span>
                <p class="text-lg font-bold">{event.name}</p>
                <p class="text mt-1">{event.location}</p>
                <div class="divider"></div>
                <p class="text-sm text-gray-500">{event.other_info}</p>
            </div>
        {/each}
    </div>
</div>

