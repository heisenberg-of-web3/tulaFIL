const TulaFIL = artifacts.require("TulaFIL")

contract("TulaFIL", async (accounts) => {
    let tulaFIL
    beforeEach(async () => {
        tulaFIL = await TulaFIL.new()
    })

    // test case to check that the function calculates the total cost correctly
    it("calculate total cost correctly", async () => {
        await tulaFIL.addProvider("Provider 1", 100, 1)
        const provider = accounts[0]
        const storage = 10
        const providerDetails = await tulaFIL.providers(provider)
        const expectedCost = storage * providerDetails.price
        const actualCost = await tulaFIL.calculateTotalCost(provider, storage)
        assert.equal(actualCost, expectedCost, "Incorrect total cost calculated")
    })

    // test case to check that the function updates the storage capacity of the provider correctly
    it("updates the storage capacity of the provider correctly", async () => {
        await tulaFIL.addProvider("Provider 2", 100, 2)
        // If you have other accounts, make sure to mention them here
        const provider = accounts[0]
        const storage = 10
        const providerDetails = await tulaFIL.providers(provider)
        const initialStorageCapacity = providerDetails.storageCapacity
        await tulaFIL.rentStorage(provider, storage)
        const providerDetailsAfter = await tulaFIL.providers(provider)
        const expectedStorageCapacity = initialStorageCapacity - storage
        const actualStorageCapacity = providerDetailsAfter.storageCapacity
        assert.equal(
            actualStorageCapacity,
            expectedStorageCapacity,
            "Incorrect storage capacity update"
        )
    })
})
