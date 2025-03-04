import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import Confirm from "./ConfirmModal";
import Image from "next/image";
import { Candidate, Contestants, Coupon } from "@/utils/schema/ApiInterface";
import { RootState, useAppSelector } from "../hooks/useStoreHooks";
import { WeAcceptPng } from "@/utils/image/image";

export const PayModal: React.FC<Coupon> = ({ ...coupon }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [paymentMethod, setPaymentMethod] = useState<'ESEWA' | 'STRIPE'>("ESEWA");
    const { candidates_by_voting_stages_data } = useAppSelector((state: RootState) => state.VotingCampaignStages);
    const candidates: Candidate[] = candidates_by_voting_stages_data.fulfilledResponse?.data.rows;

    const selectedCandidates: Candidate[] = candidates.slice(0, coupon.eligibleCandidateCounts);

    const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);

    // State to track the votes for each candidate
    const [votesPerCandidate, setVotesPerCandidate] = useState<{ [candidateId: string]: number }>({});

    useEffect(() => {
        // Initialize votesPerCandidate only if it's not already initialized
        if (Object.keys(votesPerCandidate).length === 0) {
            const initialVotes: { [candidateId: string]: number } = {};
            selectedCandidates.forEach(candidate => {
                initialVotes[candidate.candidateId] = 0;
            });
            setVotesPerCandidate(initialVotes);
        }
    }, [selectedCandidates, votesPerCandidate]);

    const handleCandidateSelect = (candidateId: string) => {
        if (selectedCandidateIds.includes(candidateId)) {
            setSelectedCandidateIds(selectedCandidateIds.filter(id => id !== candidateId));
        } else {
            if (selectedCandidateIds.length < coupon.eligibleCandidateCounts) {
                setSelectedCandidateIds([...selectedCandidateIds, candidateId]);
            }
        }
    };

    const remainingVotes = coupon.votes - Object.values(votesPerCandidate).reduce((acc, curr) => acc + curr, 0);

    const handleOpen = () => {
        onOpen();
    };

    return (
        <>
            <button onClick={handleOpen} className="bg-[var(--btncolor)] py-[1px] px-6 rounded-lg text-white mt-2">
                Buy
            </button>

            <Modal backdrop='blur' isOpen={isOpen} onClose={onClose}>
                <ModalContent className="py-3 px-3 max-w-xl">
                    {(onClose) => (
                        <>
                            <ModalBody className="">
                                <div className="flex flex-col gap-5">
                                    <div className="flex flex-col">
                                        <h3 className="text-3xl font-[500] text-[var(--blue)] font-secular">{coupon.name}</h3>
                                        <div className="flex gap-3">
                                            <span className="px-2 py-1 bg-[var(--c-rose-pink)] text-[--c-secondary] font-[500] rounded-md">
                                                {coupon.votes} votes
                                            </span>
                                            <span className="px-2 py-1 bg-[var(--c-rose-pink)] text-[--c-secondary] font-[500] rounded-md">
                                                {coupon.eligibleCandidateCounts} candidates
                                            </span>
                                        </div>
                                    </div>

                                    <div className="">
                                        <p className="text-lg text-[var(--blue)] font-[500] mb-2">Select Payment Method</p>

                                        <div className="flex gap-5">
                                            <label className="border relative h-fit rounded-lg">
                                                <input type="radio" name="paymentMethod" value="ESEWA" onClick={(e: any) => { setPaymentMethod(e.target.value) }}
                                                    className="absolute inset-0 opacity-[0]" />
                                                <Image src="/image/payment/esewa.png" height={100} width={900} alt="eSewa" className="h-[5rem] w-[9rem] object-contain" />
                                                <div className={`absolute top-0 left-0 right-0 bottom-0 border-[var(--btncolor)] rounded-lg transition-all
                                                     ${paymentMethod === "STRIPE" ? "border-10" : "border-1"}`} />
                                            </label>

                                            <label className="border relative h-fit rounded-lg">
                                                <input type="radio" name="paymentMethod" value="STRIPE" onClick={(e: any) => { setPaymentMethod(e.target.value) }}
                                                    className="absolute inset-0 opacity-[0]" />
                                                <Image src={WeAcceptPng} height={100} width={900} alt="Stripe" className="h-[5rem] w-[9rem] object-contain" />
                                                <div className={`absolute top-0 left-0 right-0 bottom-0 border-[var(--btncolor)] rounded-lg transition-all 
                                                ${paymentMethod === "ESEWA" ? "border-10" : "border-1"}`} />
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-lg text-[var(--blue)] font-[500] mb-2">Select Votes:
                                            <span className="text-lg text-[var(--light)] font-[500] mb-2">{remainingVotes} Remaining</span>
                                        </p>

                                        <div className="flex flex-col gap-2 max-h-48 overflow-y-scroll">
                                            {candidates.map((candidate: Candidate, index: number) => {
                                                const isSelected = selectedCandidateIds.includes(candidate.candidateId);
                                                return (
                                                    <div className="flex justify-around items-center" key={index}>
                                                        <div className={`px-2 py-2 flex justify-between items-center ${isSelected ? 'bg-[#117CC433]' : 'bg-[var(--pagebg)]' } rounded-lg w-[90%]`}>
                                                            <div className="flex items-center gap-2">
                                                                <Image src={process.env.NEXT_PUBLIC_AWS_URI + candidate.candidate.profilePicture} height={500} width={900} alt="img"
                                                                    className="h-[4rem] w-[6rem] rounded-md " />
                                                                <div className="flex flex-col justify-center">
                                                                    <h4 className="text-base text-[var(--blue)] font-[500] font-secular leading-none">{candidate.candidate.name}</h4>
                                                                    <p className="text-base font-[500] text-[var(--light)]">{candidate.candidate.nationality}</p>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col gap-4">
                                                                {isSelected && (
                                                                    <div className="flex items-center gap-1">
                                                                        <button className={`pay-counter ${remainingVotes === coupon.votes ? 'disable' : ''}`} onClick={() => setVotesPerCandidate(prevState => ({ ...prevState, [candidate.candidateId]: prevState[candidate.candidateId] - 1 }))}
                                                                            disabled={remainingVotes === coupon.votes}>-</button>
                                                                        <span className="pay-counter-num">{votesPerCandidate[candidate.candidateId]}</span>
                                                                        <button className={`pay-counter ${remainingVotes <= 0 ? 'disable' : ''}`} onClick={() => setVotesPerCandidate(prevState => ({ ...prevState, [candidate.candidateId]: prevState[candidate.candidateId] + 1 }))}
                                                                            disabled={remainingVotes <= 0}>+</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox-select w-4 h-4 rounded  "
                                                            checked={selectedCandidateIds.includes(candidate.candidateId)}
                                                            onChange={() => handleCandidateSelect(candidate.candidateId)}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className="mt-3">
                                <div className="w-full flex justify-between items-center">
                                    <p className="text-3xl font-[500] text-[var(--blue)] font-secular">${coupon.pricing}</p>
                                    <Confirm isDisabled={remainingVotes !== 0 || selectedCandidates.length !== coupon.eligibleCandidateCounts } paymentMethod={paymentMethod} 
                                    votesPerCandidate={votesPerCandidate} coupon={coupon} />
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
