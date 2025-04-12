<script>
    let events = [
        {
            name: "Chandigarh Carnival",
            date: "March 15, 2023",
            location: "Leisure Valley",
            description: "A vibrant festival showcasing art, culture, and music."
        },
        {
            name: "Rose Festival",
            date: "February 25, 2023",
            location: "Zakir Hussain Rose Garden",
            description: "An annual celebration of blooming roses and cultural events."
        },
        {
            name: "Food Truck Festival",
            date: "April 10, 2023",
            location: "Sector 17 Plaza",
            description: "A gathering of food trucks offering diverse cuisines."
        }
    ];
</script>

<style>
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f4f4f4;
    }
</style>

<h1>Events in Chandigarh</h1>
<table>
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