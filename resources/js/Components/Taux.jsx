<div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">
                                            <span className="label-text">Montant Payé</span>
                                        </label>
                                        <input
                                            type="number"
                                            defaultValue={stats.totalTTC.toFixed(2)}
                                            onChange={(e) => setMontantPaye(e.target.value)}
                                            disabled
                                            className="input input-bordered w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">
                                            <span className="label-text">Monnaie à Rendre</span>
                                        </label>
                                        <div className={`input input-bordered w-full flex items-center ${monnaieRendue < 0 ? 'text-error' : ''}`}>
                                            {monnaieRendue.toFixed(2)} FC

                                        </div>
                                    </div>
                                </div>