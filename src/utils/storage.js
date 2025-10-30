class Storage {
  constructor() {
    this.offer = null;
    this.leads = [];
    this.results = [];
  }

  // Offer methods
  setOffer(offerData) {
    this.offer = offerData;
  }

  getOffer() {
    return this.offer;
  }

  // Leads methods
  setLeads(leadsData) {
    this.leads = leadsData;
  }

  getLeads() {
    return this.leads;
  }

  // Results methods
  setResults(resultsData) {
    this.results = resultsData;
  }

  getResults() {
    return this.results;
  }

  // Reset all data
  reset() {
    this.offer = null;
    this.leads = [];
    this.results = [];
  }
}

// Export singleton instance
module.exports = new Storage();