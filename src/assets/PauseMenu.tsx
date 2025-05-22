function PauseMenu(ctrlon: boolean) {
    return (
        <>
            <section className={`pmenu ${ctrlon ? "active" : "inactive"}`}>
                <h1>Paused</h1>
                <input id="small-range" type="range" value="50" className="" />
            </section>

        </>
    )
}

export default PauseMenu