import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import BackButton from "../components/BackButton";
import { useEffect, useState } from "react";
import useWallet from "../hooks/useWallet";

export default function CreatePassword() {
  const navigate = useNavigate();
  const { setPasswordState } = useWallet();
  const [isCompleted, setIsCompleted] = useState(false);
  const [inputedPassword, setInputedPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const nextStep = async () => {
    setPasswordState(inputedPassword);
    navigate("/locked");
  }

  useEffect(() => {
    if( inputedPassword === confirm && inputedPassword !== "" )
      setIsCompleted(true);
    else
      setIsCompleted(false);
  }, [inputedPassword, confirm])

  return (
      <div className="retro-wallet relative">
        <div className="retro-screen">
          {/* Header */}
          <div className="text-center mt-4 space-y-1">
            <div className="flex flex-col justify-around items-center">
              <h2 className="top-8 text-[20px] font-bold text-[var(--retro-green)]">
                Choose Your Password
              </h2>
              <p className="text-[12px] mt-1 text-[var(--retro-cyan)] tracking-widest">
                Please write this down on paper as well.
              </p>
            </div>
            <BackButton route={-1}/>
          </div>

          <div className="space-y-4 flex flex-col justify-between mt-16">
            <div>
              <label className="retro-label-bold">Enter password</label>
              <Input
                placeholder="password..."
                className="retro-input"
                value={inputedPassword}
                type="password"
                onChange={(e) => setInputedPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="retro-label-bold">Enter password again</label>
              <Input
                placeholder="password..."
                className="retro-input"
                value={confirm}
                type="password"
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            <Button
              onClick={() => nextStep()}
              disabled={!isCompleted}
              className="!absolute bottom-3 retro-btn retro-btn-primary w-[90%] mb-6"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
  );
}