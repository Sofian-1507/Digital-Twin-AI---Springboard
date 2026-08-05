import { formatCurrency } from "../utils/currency";

/**
 * InfoCard — displays the user's personal information.
 * Reads from user.profile (nested backend schema from /users/me).
 * Fields available: name, age, gender, occupation, monthly_income_baseline, risk_tolerance.
 * Fields NOT in the backend schema (phone, city, education) have been removed.
 */
function InfoCard({ user }) {
  const profile = user?.profile ?? {};
  const currency = user?.preferences?.currency ?? "USD";

  return (

    <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm">

      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Personal Information</h3>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">

        <div>
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Email</label>
          <p className="mt-1.5 text-[17px] text-slate-800 dark:text-slate-100">{user?.email ?? "—"}</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Age</label>
          <p className="mt-1.5 text-[17px] text-slate-800 dark:text-slate-100">{profile.age ?? "—"}</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Gender</label>
          <p className="mt-1.5 text-[17px] text-slate-800 dark:text-slate-100">{profile.gender ?? "—"}</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Occupation</label>
          <p className="mt-1.5 text-[17px] text-slate-800 dark:text-slate-100">{profile.occupation ?? "—"}</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Monthly Income</label>
          <p className="mt-1.5 text-[17px] text-slate-800 dark:text-slate-100">
            {profile.monthly_income_baseline != null
              ? formatCurrency(profile.monthly_income_baseline, currency)
              : "—"}
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400">Risk Tolerance</label>
          <p className="mt-1.5 text-[17px] text-slate-800 dark:text-slate-100">{profile.risk_tolerance ?? "—"}</p>
        </div>

      </div>

    </div>

  );

}

export default InfoCard;
