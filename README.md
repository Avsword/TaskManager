# Task Manager

A task managment and time tracking app created with ReactJS and JSON server

# Docker link:
https://hub.docker.com/repository/docker/avsword/taskmanager/general <br />
You can just pretty much 
```
docker pull avsword/taskmanager:latest
```
<br />
After that you should be able to run the container with 

```
Docker run -p 3000:3000 taskmanager
```

# Screenshots
## Dark and Light - mode views
<img src="https://user-images.githubusercontent.com/90607504/209972831-31d0119a-59fe-4d3c-84d3-f1f5b8de4c24.png" alt="Dark mode main view" width="200" />
<img src="https://user-images.githubusercontent.com/90607504/209972976-557a8f2a-2e29-48b3-a1ef-06fc6187f0c9.png" alt="Light mode main view" width="200" />
<br />

## Tasks - tab
<img src="https://user-images.githubusercontent.com/90607504/209973111-5a966287-9633-4a75-a34b-fc9b0edfff47.png" alt="View of all of the pending tasks" width="500" /><br />
Sort by categories
<img src="https://user-images.githubusercontent.com/90607504/209973355-0f8ce747-a084-4f18-b776-eb313f7826c0.png" alt="View of the category dropdown" width="500" /><br />
Add New tasks
<img src="https://user-images.githubusercontent.com/90607504/209973271-6120b68e-223b-40fa-9f6d-5afa5e0db668.png" alt="View of adding a new task" width="500" /><br />

## Info - tab
Bar graph to reflect your tracked time!
<img src="https://user-images.githubusercontent.com/90607504/209973586-67f478aa-b57f-4a8d-a9b2-d8701eb83d26.png" alt="Bar graph of tracked time for all tasks" width="500" /><br />
Click on a bar to see daily logs for a task
<img src="https://user-images.githubusercontent.com/90607504/209973675-eb848b7b-1e26-42a5-81dc-691882a0acef.png" alt="Bar graph of tracked time for a specific task" width="500" /><br />

# Get started
```
git clone git@github.com:Avsword/TaskManager.git
cd TaskManager
npm install
# Start the server
npx json-server -H localhost -p 3010 -w ./db.json
# Alternatively you can also use
npm run db

# Now start a new terminal for the frontend
npm start
```
## "NPM INSTALL SEVERITY VULNERABILITIES"

You can ignore these. Source(s): https://stackoverflow.com/questions/72848628/why-am-i-getting-6-high-severity-vulnerabilities-on-using-create-react-app ,
https://overreacted.io/npm-audit-broken-by-design/

# How to use? (Info-tab contains this info also)
How to use this web app
Tasks
In the TODO-page, you will see all tasks, which are yet to be completed. Each task has controls for marking the task as completed, editing the task and removing the task entirely. In addition to that, each task also has controls for tracking the task's work time, and buttons for reorganizing the tasks to your liking!

The 'Completed' page shows all thats, which you have marked as completed. You can also mark it as not completed in case you made a mistake, or you can delete it forever.

The 'New Task' page allows you to create a new task to be tracked and set it's title, description, deadline and the task category

The 'Categories'-popup is a handy tool for sorting all of your tasks. You can create new categories and delete existing categories except for 'all' and 'general'.
The buttons are automatically generated from what categories exist in the database, and allow you to sort through the TODO and completed -pages.

Special notes: Should you remove a category, all the tasks which have said category will be set to have the category 'general'.

Time
By default, the 'Time' Page shows a bar graph representation of all time logged from the past week. You can toggle between minutes and hours, since 6 thousand minutes doesn't really say as much as a hundred hours.

IMPORTANT: If you wish to see the daily logs for a certain task, you will just have to press the bar on the graph and it'll automatically update itself for you! Personally, I'm really proud of this feature

By default, it shows you the past week of progress.
