const themeBtn = document.querySelector(".theme");

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const isDark =
            document.documentElement.getAttribute("data-theme") === "dark";

        if (isDark) {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
        }
    });
}

const groupNameInput = document.getElementById("groupName");

const menuItems = document.querySelectorAll(".menu-item:not(#logout)");
const pages = document.querySelectorAll(".page");
const pageTitle = document.querySelector(".page-title");

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        // sidebar active
        menuItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        // hide all pages
        pages.forEach((page) => page.classList.remove("active"));

        // show selected page
        const target = item.dataset.page;
        document.getElementById(target).classList.add("active");

        // update title
        pageTitle.textContent = item.textContent.trim();

        if (target === "groups") {
            getGroups();
        }
    });
});

async function getDashboardStats() {
    try {
        const response = await fetch("http://localhost:3000/dashboard/stats", {
            method: "GET",
            credentials: "include",
        });

        const result = await response.json();
        document.getElementById("totalBalance").innerText =
            `₹${result.data.totalBalance}`;
        document.getElementById("youOwe").innerText = `₹${result.data.youOwe}`;
        document.getElementById("youGet").innerText = `₹${result.data.youGet}`;
    } catch (err) {
        console.error("Dashboard load failed : ", err);
    }
}

getDashboardStats();

function updateGroupsView() {
    const tbody = document.getElementById("groupsTableBody");
    const emptyState = document.getElementById("groupsEmpty");
    const table = document.querySelector(".groups-table");

    if (tbody.children.length === 0) {
        table.style.display = "none";
        emptyState.style.display = "flex";
    } else {
        table.style.display = "table";
        emptyState.style.display = "none";
    }
}
updateGroupsView();

const modal = document.querySelector(".new-group-modal-container");

document.getElementById("create-group-btn").addEventListener("click", () => {
    modal.style.display = "flex";

    groupNameInput.focus();
});

document.getElementById("cancelGroup").addEventListener("click", () => {
    modal.style.display = "none";
});

async function createGroup() {
    const name = document.getElementById("groupName").value;
    const rawMembers = document.getElementById("groupMembers").value;
    const errorMsg = document.getElementById("errorMsg");

    const members = rawMembers
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

    if (!name || !members) {
        errorMsg.style.display = "flex";
        errorMsg.style.color = "red";
        errorMsg.innerText = "All fields are required!";
        setTimeout(() => {
            errorMsg.innerText = "";
        }, 2000);
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/groups/createGroup", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, members }),
        });

        const result = await response.json();

        if (!result.success) {
            errorMsg.style.display = "red";
            errorMsg.innerText = result.message;
        }

        errorMsg.style.color = "#9dff96";
        errorMsg.innerText = result.message;

        setTimeout(() => {
            modal.style.display = "none";
            name.innerText = "";
            members.innerText = "";
            getGroups();
        }, 3000);
    } catch (err) {
        console.error("Error : ", err);
        errorMsg.innerText = result.message;
    }
}

document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // 🔥 THIS STOPS SIDEBAR HANDLER
    console.log("Logout clicked");

    fetch("http://localhost:3000/authentication/logout", {
        method: "POST",
        credentials: "include",
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                window.location.replace("../Auth/index.html?mode=login");
            }
        })
        .catch((err) => console.error(err));
});

(async function checkAuth() {
    try {
        const res = await fetch("http://localhost:3000/authentication/checkAuth", {
            method: "GET",
            credentials: "include",
        });
        if (!res.ok) {
            throw new Error("Not authenticated");
        }
    } catch (err) {
        window.location.replace("../Auth/index.html");
    }
})();

async function getGroups() {
    try {
        const tbody = document.getElementById("groupsTableBody");
        tbody.innerHTML = "";
        const response = await fetch("http://localhost:3000/groups/getGroups", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const data = await response.json();

        if (!data.success) {
            throw new Error("No groups found");
        }

        data.groups.forEach((group) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `   
                <td>${group.GROUP_ID}</td>
                <td>${group.GROUP_NAME}</td>
                <td>${group.CREATED_BY}</td>
                <td class="actions">
        <button onclick="openGroup(${group.GROUP_ID})" title="Open">
            <i class="fa-solid fa-eye"></i>
        </button>

        <button onclick="addExpense(${group.GROUP_ID})" title="Add Expense">
            <i class="fa-solid fa-plus"></i>
        </button>

        <button onclick="leaveGroup(${group.GROUP_ID})" title="Leave">
            <i class="fa-solid fa-right-from-bracket"></i>
        </button>
    </td>
            `;
            tbody.appendChild(tr);
        });
        updateGroupsView();
    } catch (err) {
        console.error("Get groups error : ", err);
    }
}

async function openGroup(groupId) {
    // hide all pages
    pages.forEach(page => page.classList.remove('active'));

    // show group details page
    document.getElementById('group-details').classList.add('active');

    // update title
    pageTitle.textContent = "Group Details";

    await loadGroupDetails(groupId);
}

function backToGroups() {
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('groups').classList.add('active');
    pageTitle.textContent = "Groups";
}
