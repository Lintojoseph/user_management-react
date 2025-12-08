// src/components/auth/CompanyList.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import AppHeader from '../common/AppHeader';

const CompanyList = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const companies = user?.companies || [];

  const handleSelectCompany = (company) => {
    // save chosen company id for all other API calls
    localStorage.setItem('company_id', company.id);
    navigate('/users'); // go to user list page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Company List
        </h1>

        {companies.length === 0 ? (
          <p className="text-center text-gray-500">
            No companies found for this user.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => handleSelectCompany(company)}
                className="group flex h-full w-full flex-col rounded-2xl bg-white p-5 text-left shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Top: logo + company name/code + icon */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                      {company.company_logo_url ? (
                        <img
                          src={company.company_logo_url}
                          alt={company.company_name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Logo</span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {company.company_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {company.company_code}
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-xs text-gray-500 group-hover:border-indigo-500 group-hover:text-indigo-500">
                    ↗
                  </span>
                </div>

                {/* Big role text */}
                <div className="mb-1 text-2xl font-semibold text-gray-900">
                  {company.role || 'Customer'}
                </div>

                {/* Description / website */}
                <p className="mb-3 text-sm text-gray-500">
                  {company.website
                    ? `Website: ${company.website}`
                    : 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'}
                </p>

                {/* Footer chips */}
                <div className="mt-auto flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    Phone: {company.company_phone || 'N/A'}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    {company.currency_symbol}
                    {company.currency}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1">
                    {company.timezone}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyList;
