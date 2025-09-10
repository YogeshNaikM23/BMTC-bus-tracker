// BMTC Bus Tracker Application - Route-based System
class BMTCTracker {
    constructor() {
        this.data = {
            "routes": [
                {
                    "routeNumber": "500D",
                    "routeName": "Shivajinagar to Electronic City", 
                    "stops": ["Shivajinagar", "MG Road", "Dairy Circle", "BTM Layout", "Bommanahalli", "Electronic City"],
                    "createdBy": "department"
                },
                {
                    "routeNumber": "171K",
                    "routeName": "Majestic to Koramangala",
                    "stops": ["Majestic", "City Market", "Lalbagh", "Jayanagar", "BTM Layout", "Koramangala"],
                    "createdBy": "department"
                },
                {
                    "routeNumber": "335E", 
                    "routeName": "Banashankari to Whitefield",
                    "stops": ["Banashankari", "Jayanagar", "Dairy Circle", "MG Road", "Indiranagar", "Marathahalli", "Whitefield"],
                    "createdBy": "department"
                },
                {
                    "routeNumber": "356L",
                    "routeName": "Kempegowda Bus Station to Airport",
                    "stops": ["Kempegowda Bus Station", "Yeshwantpur", "Jalahalli", "Hebbal", "Yelahanka", "Devanahalli", "Airport"],
                    "createdBy": "department"
                }
            ],
            "activeBuses": [
                {
                    "busNumber": "KA-01-AB-1234",
                    "routeNumber": "500D",
                    "capacity": 40,
                    "currentStop": "MG Road", 
                    "currentStopIndex": 1,
                    "currentPassengers": 25,
                    "conductorId": "conductor1",
                    "conductorName": "Rajesh Kumar",
                    "journeyStartTime": "2025-08-26T09:30:00",
                    "status": "active"
                },
                {
                    "busNumber": "KA-01-CD-5678", 
                    "routeNumber": "500D",
                    "capacity": 45,
                    "currentStop": "BTM Layout",
                    "currentStopIndex": 3, 
                    "currentPassengers": 32,
                    "conductorId": "conductor2",
                    "conductorName": "Suresh Babu",
                    "journeyStartTime": "2025-08-26T08:45:00",
                    "status": "active"
                }
            ],
            "users": [
                {
                    "username": "admin",
                    "password": "admin123", 
                    "role": "department",
                    "name": "BMTC Route Manager"
                },
                {
                    "username": "conductor1",
                    "password": "cond123",
                    "role": "conductor", 
                    "name": "Rajesh Kumar",
                    "currentBus": "KA-01-AB-1234"
                },
                {
                    "username": "conductor2", 
                    "password": "cond123",
                    "role": "conductor",
                    "name": "Suresh Babu", 
                    "currentBus": "KA-01-CD-5678"
                },
                {
                    "username": "conductor3",
                    "password": "cond123", 
                    "role": "conductor",
                    "name": "Ganesh Reddy",
                    "currentBus": null
                },
                {
                    "username": "conductor4",
                    "password": "cond123",
                    "role": "conductor", 
                    "name": "Mohan Das",
                    "currentBus": null
                },
                {
                    "username": "conductor5",
                    "password": "cond123",
                    "role": "conductor", 
                    "name": "Venkat Rao", 
                    "currentBus": null
                }
            ],
            "tickets": [],
            "journeyHistory": []
        };
        
        this.currentUser = null;
        this.currentPage = 'home';
        this.selectedBus = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        this.showPage('home');
        this.setupEventListeners();
        
        // Simulate real-time updates
        setInterval(() => {
            this.simulateUpdates();
        }, 30000);
    }

    setupEventListeners() {
        // Remove existing event listeners to avoid duplicates
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
        });

        // Department login form
        const deptForm = document.getElementById('department-login-form');
        if (deptForm) {
            deptForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e, 'department');
            });
        }

        // Conductor login form
        const conductorForm = document.getElementById('conductor-login-form');
        if (conductorForm) {
            conductorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e, 'conductor');
            });
        }

        // Route search
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.searchBusesByRoute();
            });
        }

        // Enter key for route search
        const routeInput = document.getElementById('route-number');
        if (routeInput) {
            routeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchBusesByRoute();
                }
            });
        }

        // Add route form
        const addRouteForm = document.getElementById('add-route-form');
        if (addRouteForm) {
            addRouteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddRoute(e);
            });
        }

        // Add bus form
        const addBusForm = document.getElementById('add-bus-form');
        if (addBusForm) {
            addBusForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddBus(e);
            });
        }

        // Location update form
        const locationForm = document.getElementById('update-location-form');
        if (locationForm) {
            locationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLocationUpdate(e);
            });
        }

        // Ticket form
        const ticketForm = document.getElementById('issue-ticket-form');
        if (ticketForm) {
            ticketForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTicketIssue(e);
            });
        }
    }

    // Navigation
    showPage(pageId) {
        console.log('Navigating to page:', pageId);
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Show selected page
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            this.currentPage = pageId;
            console.log('Successfully showed page:', pageId);
        } else {
            console.error('Page not found:', pageId);
        }
        
        // Update user info display
        this.updateUserInfo();
        
        // Load page-specific data
        if (pageId === 'department-dashboard') {
            setTimeout(() => this.loadDepartmentDashboard(), 100);
        } else if (pageId === 'conductor-dashboard') {
            setTimeout(() => this.loadConductorDashboard(), 100);
        }

        // Re-setup event listeners for the new page
        setTimeout(() => this.setupEventListeners(), 100);
    }

    // Authentication
    handleLogin(event, role) {
        event.preventDefault();
        console.log('Handling login for role:', role);
        
        const usernameId = role === 'department' ? 'dept-username' : 'conductor-username';
        const passwordId = role === 'department' ? 'dept-password' : 'conductor-password';
        
        const usernameField = document.getElementById(usernameId);
        const passwordField = document.getElementById(passwordId);
        
        if (!usernameField || !passwordField) {
            console.error('Login fields not found');
            this.showToast('Login form error', 'error');
            return;
        }

        const username = usernameField.value.trim();
        const password = passwordField.value.trim();
        
        console.log('Attempting login with:', username, '/ [password hidden]');
        
        const user = this.data.users.find(u => 
            u.username === username && 
            u.password === password && 
            u.role === role
        );
        
        if (user) {
            this.currentUser = user;
            console.log('Login successful for user:', user.name);
            this.showToast(`Welcome ${user.name}!`, 'success');
            
            if (role === 'department') {
                this.showPage('department-dashboard');
            } else {
                this.showPage('conductor-dashboard');
            }
        } else {
            console.log('Login failed for:', username, 'with role:', role);
            this.showToast('Invalid username or password', 'error');
        }
    }

    logout() {
        this.currentUser = null;
        this.showPage('home');
        this.showToast('Logged out successfully', 'info');
    }

    updateUserInfo() {
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        
        if (this.currentUser && userInfo && userName) {
            userInfo.classList.remove('hidden');
            userName.textContent = this.currentUser.name;
        } else if (userInfo) {
            userInfo.classList.add('hidden');
        }
    }

    // Route-based search functionality
    searchBusesByRoute() {
        console.log('Searching buses by route');
        
        const routeInput = document.getElementById('route-number');
        if (!routeInput) {
            console.error('Route input not found');
            return;
        }

        const routeNumber = routeInput.value.trim().toUpperCase();
        
        if (!routeNumber) {
            this.showToast('Please enter a route number', 'error');
            return;
        }
        
        console.log('Searching for route:', routeNumber);
        
        // Check if route exists
        const route = this.data.routes.find(r => r.routeNumber.toUpperCase() === routeNumber);
        
        // Find all active buses on this route
        const activeBuses = this.data.activeBuses.filter(bus => 
            bus.routeNumber.toUpperCase() === routeNumber
        );
        
        console.log('Found', activeBuses.length, 'buses on route', routeNumber);
        this.displaySearchResults(activeBuses, routeNumber, route);
    }

    displaySearchResults(buses, routeNumber, route) {
        const resultsSection = document.getElementById('search-results');
        const busList = document.getElementById('bus-list');
        const resultsTitle = document.getElementById('results-title');
        
        if (!resultsSection || !busList || !resultsTitle) {
            console.error('Search results elements not found');
            return;
        }
        
        resultsTitle.textContent = `Buses on Route ${routeNumber}`;
        
        if (!route) {
            busList.innerHTML = `
                <div class="no-results">
                    <h3>Route not found</h3>
                    <p>Route ${routeNumber} does not exist in our system.</p>
                </div>
            `;
        } else if (buses.length === 0) {
            busList.innerHTML = `
                <div class="no-results">
                    <h3>No active buses found</h3>
                    <p>No buses are currently running on route ${routeNumber}.</p>
                    <p><strong>Route:</strong> ${route.routeName}</p>
                </div>
            `;
        } else {
            busList.innerHTML = buses.map(bus => this.createBusCard(bus)).join('');
        }
        
        resultsSection.classList.remove('hidden');
    }

    createBusCard(bus) {
        const route = this.data.routes.find(r => r.routeNumber === bus.routeNumber);
        
        return `
            <div class="bus-card">
                <div class="bus-card__header">
                    <div class="bus-card__number">${bus.busNumber}</div>
                    <div class="bus-card__route">${bus.routeNumber}</div>
                </div>
                <div class="bus-card__info">
                    <p><strong>Route:</strong> ${route ? route.routeName : 'Unknown Route'}</p>
                    <p class="bus-card__location"><strong>Current Location:</strong> ${bus.currentStop}</p>
                    <p class="bus-card__passengers"><strong>Passengers:</strong> ${bus.currentPassengers}/${bus.capacity}</p>
                    <p class="bus-card__conductor"><strong>Conductor:</strong> ${bus.conductorName}</p>
                </div>
                <button class="btn btn--primary" onclick="window.tracker.showBusDetails('${bus.busNumber}')">Track Bus</button>
            </div>
        `;
    }

    // Bus details
    showBusDetails(busNumber) {
        console.log('Showing bus details for:', busNumber);
        
        this.selectedBus = this.data.activeBuses.find(b => b.busNumber === busNumber);
        if (!this.selectedBus) {
            this.showToast('Bus not found', 'error');
            return;
        }
        
        const route = this.data.routes.find(r => r.routeNumber === this.selectedBus.routeNumber);
        const content = document.getElementById('bus-details-content');
        
        if (!content) {
            console.error('Bus details content element not found');
            return;
        }
        
        content.innerHTML = `
            <div class="bus-details">
                <div class="bus-header">
                    <h2>Bus ${this.selectedBus.busNumber}</h2>
                    <p><strong>Route:</strong> ${route.routeNumber} - ${route.routeName}</p>
                    <p><strong>Conductor:</strong> ${this.selectedBus.conductorName}</p>
                    <div class="bus-status">
                        <div class="status-item">
                            <span class="status-item__value">${this.selectedBus.currentStop}</span>
                            <span class="status-item__label">Current Location</span>
                        </div>
                        <div class="status-item">
                            <span class="status-item__value">${this.selectedBus.currentPassengers}/${this.selectedBus.capacity}</span>
                            <span class="status-item__label">Passengers</span>
                        </div>
                        <div class="status-item">
                            <span class="status-item__value">${this.selectedBus.status}</span>
                            <span class="status-item__label">Status</span>
                        </div>
                    </div>
                </div>
                
                <div class="route-map">
                    <h3>Route Progress</h3>
                    <div class="route-stops">
                        ${route.stops.map((stop, index) => `
                            <div class="stop-item ${index < this.selectedBus.currentStopIndex ? 'passed' : ''} ${index === this.selectedBus.currentStopIndex ? 'current' : ''}">
                                <div class="stop-indicator"></div>
                                <div class="stop-name">${stop}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        this.showPage('bus-details');
    }

    // Department Dashboard - Route Management Only
    loadDepartmentDashboard() {
        console.log('Loading department dashboard');
        this.showDeptSection('add-route');
        this.populateRouteSelect();
    }

    showDeptSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dept-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Update active nav item
        document.querySelectorAll('.sidebar-nav__item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        // Update active nav
        const clickedItem = document.querySelector(`.sidebar-nav__item[onclick*="${sectionId}"]`);
        if (clickedItem) {
            clickedItem.classList.add('active');
        }
        
        // Load section-specific data
        if (sectionId === 'view-routes') {
            this.loadAllRoutes();
        } else if (sectionId === 'manage-routes') {
            this.loadManageRoutes();
        }

        // Re-setup event listeners
        setTimeout(() => this.setupEventListeners(), 100);
    }

    handleAddRoute(event) {
        event.preventDefault();
        
        const routeNumberField = document.getElementById('new-route-number');
        const routeNameField = document.getElementById('new-route-name');
        const stopInputs = document.querySelectorAll('.stop-input');
        
        if (!routeNumberField || !routeNameField) {
            this.showToast('Form fields not found', 'error');
            return;
        }
        
        const routeNumber = routeNumberField.value.trim().toUpperCase();
        const routeName = routeNameField.value.trim();
        
        // Validation
        if (!routeNumber) {
            this.showToast('Please enter route number', 'error');
            return;
        }
        
        if (!routeName) {
            this.showToast('Please enter route name', 'error');
            return;
        }
        
        // Check if route number already exists
        if (this.data.routes.find(r => r.routeNumber.toUpperCase() === routeNumber)) {
            this.showToast('Route number already exists', 'error');
            return;
        }
        
        // Get stops
        const stops = Array.from(stopInputs)
            .map(input => input.value.trim())
            .filter(stop => stop.length > 0);
        
        if (stops.length < 2) {
            this.showToast('Please add at least 2 stops', 'error');
            return;
        }
        
        const newRoute = {
            routeNumber: routeNumber,
            routeName: routeName,
            stops: stops,
            createdBy: "department"
        };
        
        this.data.routes.push(newRoute);
        this.showToast('Route added successfully', 'success');
        
        // Reset form
        event.target.reset();
        this.resetStopsContainer();
        this.populateRouteSelect();
    }

    addStopInput() {
        const container = document.getElementById('stops-container');
        if (!container) return;
        
        const stopInputRow = document.createElement('div');
        stopInputRow.className = 'stop-input-row';
        
        stopInputRow.innerHTML = `
            <input type="text" class="form-control stop-input" placeholder="Stop ${container.children.length + 1}" required>
            <button type="button" class="remove-stop-btn" onclick="window.tracker.removeStopInput(this)">Remove</button>
        `;
        
        container.appendChild(stopInputRow);
    }

    removeStopInput(button) {
        const container = document.getElementById('stops-container');
        if (container && container.children.length > 1) {
            button.parentElement.remove();
        }
    }

    resetStopsContainer() {
        const container = document.getElementById('stops-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="stop-input-row">
                <input type="text" class="form-control stop-input" placeholder="Stop 1" required>
                <button type="button" class="btn btn--sm btn--outline" onclick="window.tracker.addStopInput()">Add Stop</button>
            </div>
        `;
    }

    loadAllRoutes() {
        const container = document.getElementById('all-routes-list');
        if (!container) return;
        
        const html = this.data.routes.map(route => `
            <div class="route-item">
                <h4>${route.routeNumber} - ${route.routeName}</h4>
                <div class="route-stops-list">
                    ${route.stops.map(stop => `<span class="route-stop">${stop}</span>`).join('')}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }

    loadManageRoutes() {
        const container = document.getElementById('editable-routes-list');
        if (!container) return;
        
        const html = this.data.routes.map((route, index) => `
            <div class="route-item">
                <h4>${route.routeNumber} - ${route.routeName}</h4>
                <div class="route-stops-list">
                    ${route.stops.map(stop => `<span class="route-stop">${stop}</span>`).join('')}
                </div>
                <button class="btn btn--sm btn--outline mt-16" onclick="window.tracker.showEditRoute(${index})">Edit Route</button>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }

    showEditRoute(index) {
        // Implementation for editing routes (simplified for demo)
        this.showToast('Route editing feature coming soon', 'info');
    }

    // Conductor Dashboard - Bus Operations
    loadConductorDashboard() {
        console.log('Loading conductor dashboard');
        
        if (!this.currentUser || this.currentUser.role !== 'conductor') {
            console.error('Invalid user for conductor dashboard');
            return;
        }
        
        this.populateRouteSelect();
        
        // Check if conductor has active bus
        const activeBus = this.data.activeBuses.find(b => b.conductorId === this.currentUser.username);
        
        if (activeBus) {
            this.showActiveBusSection(activeBus);
        } else {
            this.showNoBusSection();
        }
    }

    showNoBusSection() {
        const statusDiv = document.getElementById('conductor-status');
        if (statusDiv) {
            statusDiv.innerHTML = `
                <div class="no-bus-status">
                    <h4>No Active Journey</h4>
                    <p>Start a new journey by adding a bus to a route</p>
                </div>
            `;
            statusDiv.className = 'conductor-status no-bus';
        }
        
        const noBusSection = document.getElementById('no-bus-section');
        const activeBusSection = document.getElementById('active-bus-section');
        
        if (noBusSection) noBusSection.classList.remove('hidden');
        if (activeBusSection) activeBusSection.classList.add('hidden');
    }

    showActiveBusSection(bus) {
        const statusDiv = document.getElementById('conductor-status');
        const route = this.data.routes.find(r => r.routeNumber === bus.routeNumber);
        
        if (statusDiv) {
            statusDiv.innerHTML = `
                <h4>Active Journey</h4>
                <p><strong>Bus:</strong> ${bus.busNumber} | <strong>Route:</strong> ${bus.routeNumber} - ${route.routeName}</p>
            `;
            statusDiv.className = 'conductor-status';
        }
        
        const noBusSection = document.getElementById('no-bus-section');
        const activeBusSection = document.getElementById('active-bus-section');
        
        if (noBusSection) noBusSection.classList.add('hidden');
        if (activeBusSection) activeBusSection.classList.remove('hidden');
        
        this.loadBusOperations(bus);
    }

    handleAddBus(event) {
        event.preventDefault();
        
        const busNumberField = document.getElementById('bus-number');
        const routeField = document.getElementById('bus-route');
        const capacityField = document.getElementById('bus-capacity');
        
        if (!busNumberField || !routeField || !capacityField) {
            this.showToast('Form fields not found', 'error');
            return;
        }
        
        const busNumber = busNumberField.value.trim();
        const routeNumber = routeField.value;
        const capacity = parseInt(capacityField.value);
        
        // Validation
        if (!busNumber) {
            this.showToast('Please enter bus number', 'error');
            return;
        }
        
        if (!routeNumber) {
            this.showToast('Please select a route', 'error');
            return;
        }
        
        if (!capacity || capacity < 20 || capacity > 60) {
            this.showToast('Please enter valid capacity (20-60)', 'error');
            return;
        }
        
        // Check if bus number already exists
        if (this.data.activeBuses.find(b => b.busNumber === busNumber)) {
            this.showToast('Bus number already exists', 'error');
            return;
        }
        
        const selectedRoute = this.data.routes.find(r => r.routeNumber === routeNumber);
        if (!selectedRoute) {
            this.showToast('Invalid route selected', 'error');
            return;
        }
        
        const newBus = {
            busNumber: busNumber,
            routeNumber: routeNumber,
            capacity: capacity,
            currentStop: selectedRoute.stops[0],
            currentStopIndex: 0,
            currentPassengers: 0,
            conductorId: this.currentUser.username,
            conductorName: this.currentUser.name,
            journeyStartTime: new Date().toISOString(),
            status: 'active'
        };
        
        this.data.activeBuses.push(newBus);
        
        // Update user's current bus
        const userIndex = this.data.users.findIndex(u => u.username === this.currentUser.username);
        if (userIndex !== -1) {
            this.data.users[userIndex].currentBus = busNumber;
            this.currentUser.currentBus = busNumber;
        }
        
        this.showToast('Journey started successfully', 'success');
        
        // Reset form and show active section
        event.target.reset();
        this.showActiveBusSection(newBus);
    }

    loadBusOperations(bus) {
        const route = this.data.routes.find(r => r.routeNumber === bus.routeNumber);
        
        // Update current bus info
        const busInfoDiv = document.getElementById('current-bus-info');
        if (busInfoDiv) {
            busInfoDiv.innerHTML = `
                <div class="current-bus-info">
                    <h4>Bus ${bus.busNumber}</h4>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Route</span>
                            <span class="info-value">${bus.routeNumber} - ${route.routeName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Current Location</span>
                            <span class="info-value">${bus.currentStop}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Passengers</span>
                            <span class="info-value">${bus.currentPassengers}/${bus.capacity}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Available Seats</span>
                            <span class="info-value">${bus.capacity - bus.currentPassengers}</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Populate location dropdown
        const locationSelect = document.getElementById('current-location');
        if (locationSelect) {
            locationSelect.innerHTML = '<option value="">Select current stop</option>';
            route.stops.forEach(stop => {
                const option = new Option(stop, stop);
                if (stop === bus.currentStop) {
                    option.selected = true;
                }
                locationSelect.appendChild(option);
            });
        }
        
        // Populate ticketing stops
        this.populateTicketingStops(route.stops);
        this.updatePassengerInfo();
        this.updateJourneyStatus(bus, route);
    }

    populateRouteSelect() {
        const routeSelect = document.getElementById('bus-route');
        if (!routeSelect) return;
        
        routeSelect.innerHTML = '<option value="">Select Route Number</option>';
        
        this.data.routes.forEach(route => {
            const option = new Option(`${route.routeNumber} - ${route.routeName}`, route.routeNumber);
            routeSelect.appendChild(option);
        });
    }

    populateTicketingStops(stops) {
        const boardingSelect = document.getElementById('boarding-stop');
        const alightingSelect = document.getElementById('alighting-stop');
        
        if (boardingSelect) {
            boardingSelect.innerHTML = '<option value="">Select boarding stop</option>';
            stops.forEach(stop => {
                boardingSelect.appendChild(new Option(stop, stop));
            });
        }

        if (alightingSelect) {
            alightingSelect.innerHTML = '<option value="">Select alighting stop</option>';
            stops.forEach(stop => {
                alightingSelect.appendChild(new Option(stop, stop));
            });
        }
    }

    handleLocationUpdate(event) {
        event.preventDefault();
        
        const newLocationField = document.getElementById('current-location');
        if (!newLocationField) {
            this.showToast('Location field not found', 'error');
            return;
        }
        
        const newLocation = newLocationField.value;
        if (!newLocation) {
            this.showToast('Please select a location', 'error');
            return;
        }
        
        const activeBus = this.data.activeBuses.find(b => b.conductorId === this.currentUser.username);
        if (!activeBus) {
            this.showToast('No active bus found', 'error');
            return;
        }

        const route = this.data.routes.find(r => r.routeNumber === activeBus.routeNumber);
        
        // Update bus location
        activeBus.currentStop = newLocation;
        activeBus.currentStopIndex = route.stops.indexOf(newLocation);
        
        // Process passenger alighting
        this.processPassengerAlighting(activeBus, newLocation);
        
        this.showToast(`Location updated to ${newLocation}`, 'success');
        this.loadBusOperations(activeBus);
    }

    processPassengerAlighting(bus, currentStop) {
        // Find tickets where passengers are alighting at current stop
        const alightingTickets = this.data.tickets.filter(ticket => 
            ticket.busNumber === bus.busNumber && ticket.toStop === currentStop
        );
        
        // Reduce passenger count
        const alightingPassengers = alightingTickets.reduce((sum, ticket) => sum + ticket.passengers, 0);
        bus.currentPassengers = Math.max(0, bus.currentPassengers - alightingPassengers);
        
        // Remove processed tickets
        this.data.tickets = this.data.tickets.filter(ticket => 
            !(ticket.busNumber === bus.busNumber && ticket.toStop === currentStop)
        );
        
        if (alightingPassengers > 0) {
            this.showToast(`${alightingPassengers} passengers alighted`, 'info');
        }
    }

    handleTicketIssue(event) {
        event.preventDefault();
        
        const boardingStopField = document.getElementById('boarding-stop');
        const alightingStopField = document.getElementById('alighting-stop');
        const passengerCountField = document.getElementById('passenger-count');
        const ticketTypeField = document.getElementById('ticket-type');
        
        if (!boardingStopField || !alightingStopField || !passengerCountField || !ticketTypeField) {
            this.showToast('Form fields not found', 'error');
            return;
        }
        
        const boardingStop = boardingStopField.value;
        const alightingStop = alightingStopField.value;
        const passengerCount = parseInt(passengerCountField.value);
        const ticketType = ticketTypeField.value;
        
        if (!boardingStop || !alightingStop) {
            this.showToast('Please select boarding and alighting stops', 'error');
            return;
        }
        
        if (boardingStop === alightingStop) {
            this.showToast('Boarding and alighting stops cannot be the same', 'error');
            return;
        }
        
        const activeBus = this.data.activeBuses.find(b => b.conductorId === this.currentUser.username);
        if (!activeBus) {
            this.showToast('No active bus found', 'error');
            return;
        }

        const route = this.data.routes.find(r => r.routeNumber === activeBus.routeNumber);
        
        // Validate stops are on the route and in correct order
        const boardingIndex = route.stops.indexOf(boardingStop);
        const alightingIndex = route.stops.indexOf(alightingStop);
        
        if (boardingIndex === -1 || alightingIndex === -1) {
            this.showToast('Invalid stops selected', 'error');
            return;
        }
        
        if (boardingIndex >= alightingIndex) {
            this.showToast('Alighting stop must be after boarding stop', 'error');
            return;
        }
        
        // Check capacity
        if (activeBus.currentPassengers + passengerCount > activeBus.capacity) {
            this.showToast('Bus capacity exceeded', 'error');
            return;
        }
        
        // Create ticket
        const ticket = {
            id: `TKT${Date.now()}`,
            busNumber: activeBus.busNumber,
            fromStop: boardingStop,
            toStop: alightingStop,
            passengers: passengerCount,
            type: ticketType,
            timestamp: new Date().toISOString()
        };
        
        this.data.tickets.push(ticket);
        activeBus.currentPassengers += passengerCount;
        
        this.showToast(`Ticket issued for ${passengerCount} passengers`, 'success');
        this.loadBusOperations(activeBus);
        
        // Reset form
        event.target.reset();
        passengerCountField.value = '1';
    }

    updatePassengerInfo() {
        if (!this.currentUser || this.currentUser.role !== 'conductor') return;
        
        const activeBus = this.data.activeBuses.find(b => b.conductorId === this.currentUser.username);
        if (!activeBus) return;

        const busTickets = this.data.tickets.filter(t => t.busNumber === activeBus.busNumber);
        
        const passengerInfo = document.getElementById('passenger-info');
        if (!passengerInfo) return;
        
        const upcomingStops = this.getUpcomingAlightingStops(activeBus, busTickets);
        
        passengerInfo.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Current Passengers</span>
                <span class="stat-value">${activeBus.currentPassengers}/${activeBus.capacity}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Available Seats</span>
                <span class="stat-value">${activeBus.capacity - activeBus.currentPassengers}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Active Tickets</span>
                <span class="stat-value">${busTickets.length}</span>
            </div>
            ${upcomingStops.length > 0 ? `
                <div style="margin-top: 16px;">
                    <h4>Upcoming Stops</h4>
                    ${upcomingStops.map(stop => `
                        <div class="stat-item">
                            <span class="stat-label">${stop.stop}</span>
                            <span class="stat-value">${stop.passengers} alighting</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        `;
    }

    getUpcomingAlightingStops(bus, tickets) {
        const route = this.data.routes.find(r => r.routeNumber === bus.routeNumber);
        const upcomingStops = route.stops.slice(bus.currentStopIndex + 1);
        
        return upcomingStops.map(stop => {
            const passengers = tickets
                .filter(t => t.toStop === stop)
                .reduce((sum, t) => sum + t.passengers, 0);
            return { stop, passengers };
        }).filter(item => item.passengers > 0);
    }

    updateJourneyStatus(bus, route) {
        const journeyStatusDiv = document.getElementById('journey-status');
        const endJourneyBtn = document.getElementById('end-journey-btn');
        
        if (!journeyStatusDiv || !endJourneyBtn) return;
        
        const isAtFinalStop = bus.currentStopIndex === route.stops.length - 1;
        
        if (isAtFinalStop) {
            journeyStatusDiv.innerHTML = `
                <div class="at-final-stop">
                    <h5>Journey Complete</h5>
                    <p>Bus has reached the final stop. You can end the journey.</p>
                </div>
            `;
            endJourneyBtn.classList.remove('hidden');
        } else {
            journeyStatusDiv.innerHTML = `
                <div class="journey-progress">
                    <h5>Journey in Progress</h5>
                    <p>Stop ${bus.currentStopIndex + 1} of ${route.stops.length}</p>
                    <p>Next: ${route.stops[bus.currentStopIndex + 1] || 'Final Stop'}</p>
                </div>
            `;
            endJourneyBtn.classList.add('hidden');
        }
    }

    endJourney() {
        if (!this.currentUser || this.currentUser.role !== 'conductor') return;
        
        const activeBus = this.data.activeBuses.find(b => b.conductorId === this.currentUser.username);
        if (!activeBus) return;
        
        // Remove bus from active buses
        this.data.activeBuses = this.data.activeBuses.filter(b => b.busNumber !== activeBus.busNumber);
        
        // Remove tickets for this bus
        this.data.tickets = this.data.tickets.filter(t => t.busNumber !== activeBus.busNumber);
        
        // Update user's current bus
        const userIndex = this.data.users.findIndex(u => u.username === this.currentUser.username);
        if (userIndex !== -1) {
            this.data.users[userIndex].currentBus = null;
            this.currentUser.currentBus = null;
        }
        
        // Add to journey history
        this.data.journeyHistory.push({
            ...activeBus,
            endTime: new Date().toISOString()
        });
        
        this.showToast('Journey ended successfully', 'success');
        
        // Auto-logout
        setTimeout(() => {
            this.logout();
        }, 2000);
    }

    // Utility functions
    simulateUpdates() {
        // Simulate random bus movements
        this.data.activeBuses.forEach(bus => {
            if (Math.random() < 0.3) { // 30% chance of update
                const route = this.data.routes.find(r => r.routeNumber === bus.routeNumber);
                if (route && bus.currentStopIndex < route.stops.length - 1) {
                    if (Math.random() < 0.5) {
                        bus.currentStopIndex++;
                        bus.currentStop = route.stops[bus.currentStopIndex];
                        this.processPassengerAlighting(bus, bus.currentStop);
                    }
                }
            }
        });
        
        // Refresh displays if on relevant pages
        if (this.currentPage === 'bus-details' && this.selectedBus) {
            this.showBusDetails(this.selectedBus.busNumber);
        }
        
        if (this.currentPage === 'conductor-dashboard' && this.currentUser) {
            const activeBus = this.data.activeBuses.find(b => b.conductorId === this.currentUser.username);
            if (activeBus) {
                this.loadBusOperations(activeBus);
            }
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }
}

// Initialize the tracker and make it globally available
window.tracker = new BMTCTracker();

// Global functions for HTML onclick handlers
function showPage(pageId) {
    window.tracker.showPage(pageId);
}

function searchBusesByRoute() {
    window.tracker.searchBusesByRoute();
}

function handleLogin(event, role) {
    window.tracker.handleLogin(event, role);
}

function logout() {
    window.tracker.logout();
}

function showDeptSection(sectionId) {
    window.tracker.showDeptSection(sectionId);
}

function handleAddRoute(event) {
    window.tracker.handleAddRoute(event);
}

function addStopInput() {
    window.tracker.addStopInput();
}

function handleAddBus(event) {
    window.tracker.handleAddBus(event);
}

function handleLocationUpdate(event) {
    window.tracker.handleLocationUpdate(event);
}

function handleTicketIssue(event) {
    window.tracker.handleTicketIssue(event);
}

function endJourney() {
    window.tracker.endJourney();
}